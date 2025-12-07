import io
import os
import streamlit as st
import matplotlib.pyplot as plt
from epyt import epanet

st.set_page_config(page_title="EPANET Network Viewer", layout="wide")
st.title("EPANET Network Viewer")

# Sidebar controls
with st.sidebar:
    st.header("Upload and Options")

    uploaded_file = st.file_uploader(
        "Upload an EPANET (.inp) file", type=["inp"],
        help="Upload your EPANET input file to visualize the network."
    )

    st.subheader("Render Settings")
    col1, col2 = st.columns(2)
    with col1:
        width_in = st.slider("Figure width (in)", 3.0, 16.0, 8.0, 0.5)
        show_legend = st.checkbox("Show legend", value=True)
        show_nodes_id = st.checkbox("Show node IDs", value=False)
    with col2:
        height_in = st.slider("Figure height (in)", 2.0, 12.0, 6.0, 0.5)
        dpi = st.slider("DPI", 100, 600, 300, 50)
        show_links_id = st.checkbox("Show link IDs", value=False)

    st.caption("💡 Tip: Increase DPI and figure size for sharper plots.")

# --- Load Network ---
@st.cache_resource(show_spinner=True)
def load_network(inp_path: str):
    """Load an EPANET network using epyt.epanet"""
    return epanet(inp_path)

def get_network_from_upload(file):
    """Save uploaded file to disk and load it"""
    if file is None:
        st.info("👆 Please upload an EPANET (.inp) file to begin.")
        st.stop()

    temp_path = os.path.join(".", file.name)
    with open(temp_path, "wb") as f:
        f.write(file.getvalue())

    try:
        d = load_network(temp_path)
        return d
    except Exception as e:
        st.error(f"❌ Failed to load network: {e}")
        st.stop()

d = get_network_from_upload(uploaded_file)

# --- Plot Network ---
def make_plot_or_stop(d_obj):
    try:
        # Apply ID display logic
        if show_nodes_id and show_links_id:
            fig = d_obj.plot(nodesID=True, linksID=True)
        elif show_nodes_id:
            fig = d_obj.plot(nodesID=True)
        elif show_links_id:
            fig = d_obj.plot(linksID=True)
        else:
            fig = d_obj.plot()

        # Adjust size and DPI
        fig.set_size_inches(width_in, height_in)
        fig.set_dpi(dpi)
        return fig

    except Exception as e:
        st.error(f"❌ Failed to plot network. Error: {e}")
        st.stop()

fig = make_plot_or_stop(d)

# --- Display Plot ---
st.pyplot(fig, use_container_width=True, clear_figure=False)

# --- Download Button ---
with io.BytesIO() as buf:
    try:
        fig.savefig(buf, format="png", dpi=dpi, bbox_inches="tight")
        st.download_button(
            label="⬇️ Download Plot as PNG",
            data=buf.getvalue(),
            file_name="network.png",
            mime="image/png",
            type="secondary"
        )
    except Exception:
        pass

# --- Cleanup (optional) ---
try:
    if d is not None:
        d.plot_close()
except Exception:
    pass

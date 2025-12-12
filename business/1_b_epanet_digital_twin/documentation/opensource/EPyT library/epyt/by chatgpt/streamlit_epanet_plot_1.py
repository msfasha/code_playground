import streamlit as st
from epyt import epanet
import os

st.title("EPANET Network Viewer (epyt-based)")
st.write("Upload an EPANET .inp file and visualize the network layout.")

uploaded_file = st.file_uploader("Choose an EPANET (.inp) file", type=["inp"])

if uploaded_file is not None:
    temp_file = "uploaded_network.inp"
    with open(temp_file, "wb") as f:
        f.write(uploaded_file.read())
        
    st.success(f"File `{uploaded_file.name}` uploaded successfully!")

    try:
        # Load the network
        d = epanet(temp_file)

        st.write("### Network Summary")
        st.write(f"**Working directory:** {os.getcwd()}")
        st.write(f"**Nodes:** {len(d.getNodeNameID())}")
        st.write(f"**Links:** {len(d.getLinkNameID())}")

        # Plot directly (epyt handles figure creation internally)
        fig = d.plot(nodesID=True, linksID=True)
        st.pyplot(fig)

    except Exception as e:
        st.error(f"Error loading network: {e}")
else:
    st.info("Please upload a .inp file to begin.")


st.
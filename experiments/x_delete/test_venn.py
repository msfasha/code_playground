# test_venn.py
import matplotlib.pyplot as plt
from matplotlib_venn import venn2

# Define the probabilities
P_A = 0.6  # Probability that an item is produced by Factory A
P_B = 0.4  # Probability that an item is produced by Factory B

# Define the conditional probabilities
P_Broken_given_A = 0.3
P_Broken_given_B = 0.7

# Calculate the joint probabilities
P_A_and_Broken = P_A * P_Broken_given_A
P_B_and_Broken = P_B * P_Broken_given_B
P_A_and_Not_Broken = P_A * (1 - P_Broken_given_A)
P_B_and_Not_Broken = P_B * (1 - P_Broken_given_B)

# Create the Venn diagram
plt.figure(figsize=(8, 6))
venn = venn2(subsets=(P_A, P_B, 0), set_labels=('Factory A', 'Factory B'))

# Annotate the diagram with the broken probabilities
venn.get_label_by_id('10').set_text(f'Broken: {P_A_and_Broken:.2f}\nNot Broken: {P_A_and_Not_Broken:.2f}')
venn.get_label_by_id('01').set_text(f'Broken: {P_B_and_Broken:.2f}\nNot Broken: {P_B_and_Not_Broken:.2f}')

# Set the title
plt.title("Probability of Items Being Broken or Not from Factories A and B")

# Show the plot
plt.show()

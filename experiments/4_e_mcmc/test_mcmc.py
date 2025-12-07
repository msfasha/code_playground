import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# Sample data: customer spending
np.random.seed(42)
data = np.random.normal(50, 10, 100)  # 100 customers with mean spending of 50 and std dev of 10
print(np.mean(data))
# Initial parameter value
mu_t = 100.0  # Initial guess for the mean

# Proposal distribution standard deviation
proposal_std_dev = 1.0

# Prior parameters
mu_prior = 0
sigma_prior = 10

# Likelihood function
def likelihood(data, mu):
    return np.sum(norm.logpdf(data, mu, 1))

# Prior function
def prior(mu):
    return norm.logpdf(mu, mu_prior, sigma_prior)

# Posterior function
def posterior(data, mu):
    return likelihood(data, mu) + prior(mu)

# Metropolis-Hastings algorithm
num_iterations = 10000
samples = []

for t in range(num_iterations):
    # Propose a new state
    mu_prime = np.random.normal(mu_t, proposal_std_dev)
    
    # Compute the acceptance ratio
    acceptance_ratio = np.exp(posterior(data, mu_prime) - posterior(data, mu_t))
    
    # Generate a random number
    u = np.random.uniform(0, 1)
    
    # Accept or reject the new state
    if u <= acceptance_ratio:
        mu_t = mu_prime  # Accept the new state
    
    samples.append(mu_t)

# Convert samples to a numpy array
samples = np.array(samples)

# Print the estimated mean spending
estimated_mean = np.mean(samples)
print(f"Estimated Mean Customer Spending: {estimated_mean:.2f}")

# Analyze the samples (posterior estimates)
plt.hist(samples, bins=50, color='blue', alpha=0.7)
plt.title('Posterior Distribution of Mean Customer Spending')
plt.xlabel('Mean Spending')
plt.ylabel('Frequency')
plt.show()



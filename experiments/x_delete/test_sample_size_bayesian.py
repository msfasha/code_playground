import numpy as np
from scipy.stats import beta

def bayesian_sample_size(alpha, beta_prior, p_true, margin_error, confidence_level, max_n):
    for n in range(1, max_n + 1):
        y = np.random.binomial(n, p_true)
        posterior_alpha = alpha + y
        posterior_beta = beta_prior + n - y
        lower_bound = beta.ppf((1 - confidence_level) / 2, posterior_alpha, posterior_beta)
        upper_bound = beta.ppf(1 - (1 - confidence_level) / 2, posterior_alpha, posterior_beta)
        interval_width = upper_bound - lower_bound
        if interval_width <= margin_error:
            print("Done")
            return n
    return None

# Parameters
alpha_prior = 1
beta_prior = 1
p_true = 0.5  # Assumed true proportion
margin_error = 0.12
confidence_level = 0.95
max_n = 600

sample_size = bayesian_sample_size(alpha_prior, beta_prior, p_true, margin_error, confidence_level, max_n)
print("Required sample size:", sample_size)

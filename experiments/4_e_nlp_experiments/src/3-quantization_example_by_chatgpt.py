# I tried to understand the quantization process
# The code below was a result of chatting with ChatGPT

import numpy as np

step_size = 0

def linear_quantization(data, num_bits):
    # Calculate the range of the data
    data_range = np.max(data) - np.min(data)
    
    # Calculate the step size for quantization
    global step_size 
    step_size = data_range / (2**num_bits)
    
    # Quantize the data
    quantized_data = np.round(data / step_size) * step_size
    
    return quantized_data

# Example input data (random values)
original_data = np.random.rand(50) * 10 - 5

# Perform linear quantization
num_bits = 16
quantized_data = linear_quantization(original_data, num_bits)

dequantized_data = quantized_data * step_size

mse = np.mean((original_data - dequantized_data)**2)

print("Original Data:")
print(original_data)
print("\nQuantized Data:")
print(quantized_data)
print("Rebuilding the original data")
print("Number of unique de-quantized values:", len(np.unique(dequantized_data)))
print("Mean Square Error: ", mse)


# Calculate the Peak Signal-to-Noise Ratio (PSNR)
max_value = np.max(original_data)
psnr = 20 * np.log10(max_value / np.sqrt(mse))

print("Peak Signal-to-Noise Ratio:", psnr, "dB")




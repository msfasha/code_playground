import torch

# Check if CUDA is available
if torch.cuda.is_available():
    # Device configuration
    device = torch.device('cuda')
    print('CUDA is available. Using GPU:', torch.cuda.get_device_name(0))
else:
    device = torch.device('cpu')
    print('CUDA is not available. Using CPU.')

# Create some random data
input_data = torch.randn(100000, 100000).to(device)

# Perform a simple operation (e.g., matrix multiplication)
output = torch.mm(input_data, input_data.t())

# Wait for the computation to finish
torch.cuda.synchronize()

print('Computation completed successfully.')

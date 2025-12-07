import numpy as np

# ar1 = np.array([1.45,.71])
# ar2 = np.array([[1.5,-2.1],[-1.5,.7]])
# ar3 = np.array([[-.8,-1.7],[.4,2.8]])

# result = np.dot(ar1, ar2.T)  # or ar1 @ ar2

# print (result)
# # print (ar1@ar2.T)

# softmax_result = np.exp(result) / np.sum(result)

# # print(softmax_result)

# # print(np.exp(result[0]))
# # print(np.exp(result))
# # print(np.sum(np.exp(result)))

# print(result, np.argmax(result))
input = np.random.randn(1,10)
node1 = np.random.randn(10,4)
node2 = np.random.randn(4,1)

print(input@node1@node2)


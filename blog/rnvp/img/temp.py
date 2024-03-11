import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# define constants
mu = 0.0 
sigma = 1.0

x = np.arange(-4, 4, 0.001) # range of x in spec
y = norm.pdf(x,mu,sigma) #+ norm.pdf(x,mu+3.0,0.4*sigma)

# build the plot
fig, ax = plt.subplots(figsize=(9,6))
plt.style.use('seaborn-muted')
ax.plot(x,y)

from matplotlib import rc
rc('font', **{'family':'serif', 'serif':['Times'], 'size':50})
rc('xtick', **{'labelsize':12})

# ax.fill_between(x,y,0, alpha=0.3, color='b')
ax.fill_between(x, y, 0, alpha=0.1)
# ax.set_xlim([-4,4])
# ax.set_xlabel('# of Standard Deviations Outside the Mean')
# ax.set_yticklabels([])
# ax.set_title('Normal Gaussian Curve')
# plt.axis('off')
plt.savefig('temp.svg') #, dpi=72), bbox_inches='tight')


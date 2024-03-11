def t_net():
	return nn.Sequential(nn.Linear(2, 20), nn.ReLU(), nn.Linear(20, 2), nn.Tanh())

def s_net():
	return nn.Sequential(nn.Linear(2, 20), nn.ReLU(), nn.Linear(20, 2))

class RealNVP2D(nn.Module):
	def __init__(self, mask, prior):
		super(RealNVP2D, self).__init__()
		self.t = [t_net(), t_net()]
		self.s = [s_net(), s_net()]
		self.z_pdf = distributions.MultivariateNormal(torch.zeros(2), torch.eye(2))
		self.mask = nn.Parameter(torch.Tensor([[1,0],[0,1]]), requires_grad=False)

	def f(self, x):
		x0 = x * self.mask[0]
		x1 = x * self.mask[1]
		s0 = self.s[0](x0)
		t0 = self.t[0](x0)
		x_prime = x0 + self.mask[1] * (x1 * torch.exp(s0) + t0)
		
		
		
		
		s = self.s[0](
		s0, t0 = self.s[0], self.t[0]
		s1, t1 = self.s[1], self.t[1]
		xp_0 = 
		x_prime = x * self.mask[0] + x * self.mask[1] * torch.exp(s0)
		x_prime = 
		x1 = x[0] * 
		x2 = x[1]
		
		
		
		
		log_det_J, z = x.new_zeros(x.shape[0]), x
		for i in reversed(range(len(self.t))):
			z_ = self.mask[i] * z
			s = self.s[i](z_) * (1-self.mask[i])
			t = self.t[i](z_) * (1-self.mask[i])
			z = (1 - self.mask[i]) * (z - t) * torch.exp(-s) + z_
			log_det_J -= s.sum(dim=1)
		return z, log_det_J

	def log_prob(self,x):
		z, logp = self.f(x)
		return self.prior.log_prob(z) + logp

	def sample(self, batchSize): 
		z = self.prior.sample((batchSize, 1))
		x = self.g(z)
		return x

flow = RealNVP(nets, nett, masks, prior)

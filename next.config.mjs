/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// Enable the experimental features necessary for dynamic API routes
		runtime: "nodejs", // or 'edge' if you are using edge functions
	},
};

export default nextConfig;

module.exports = ({ env }) => ({
  seo: {
    enabled: true,
  },
  upload: {
    config: {
      providerOptions: {
        sizeOptimization: false,
      },
    },
  },
});

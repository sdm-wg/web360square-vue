module.exports = {
  purge: {
    content: ["./public/**/*.html", "./src/**/*.vue"],
    options: {
      defaultExtractor: (content) => {
        const contentWithoutStyleBlocks = content.replace(
          /<style[^]+?<\/style>/gi,
          ""
        );
        return (
          contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) ||
          []
        );
      },
      whitelistPatterns: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
      ],
    },
  },
  theme: {},
  variants: {},
  plugins: [],
};

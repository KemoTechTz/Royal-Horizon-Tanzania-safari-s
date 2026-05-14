const imageModules = import.meta.glob("../asset/image/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
});

const normalizeName = (path) => {
  return path
    .split("/")
    .pop()
    .replace(/\.(png|jpg|jpeg|webp|svg)$/i, "");
};

export const imageLibrary = Object.fromEntries(
  Object.entries(imageModules).map(([path, imageUrl]) => [normalizeName(path), imageUrl])
);

export const getImage = (name, fallback = "") => {
  return imageLibrary[name] || fallback;
};

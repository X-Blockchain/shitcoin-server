const dir = __dirname;
const fs = require("fs");
const width = 1000;
const height = 1000;

const addLayer = (_id, _name, img, _position, _size) => {
  if (!_id) {
    console.log("error adding layer, parameters id required");
    return null;
  }
  if (!_position) {
    _position = { x: 0, y: 0 };
  }
  if (!_size) {
    _size = { width: width, height: height };
  }
  let _elements = `${dir}/${_name}/${img}`;
  // let values = finData(_name, _elements.name);
  let values = { name: _name, fileName: img };
  let _location = `${dir}/`;
  let elementsForLayer = {
    name: _name,
    location: _location,
    elements: _elements,
    posittion: _position,
    size: _size,
    bodyValues: values,
  };
  return elementsForLayer;
};

module.exports = {
  addLayer,
  width,
  height,
};

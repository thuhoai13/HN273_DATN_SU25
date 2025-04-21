const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET tất cả sản phẩm
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET sản phẩm theo Id
router.get('/:id', async (req, res) => {
    const products = await Product.find();
    res.json(products);
  });
  

// POST thêm sản phẩm
router.post('/', async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// PUT cập nhật sản phẩm
router.put('/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// DELETE xóa sản phẩm
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Xóa thành công' });
});

module.exports = router;

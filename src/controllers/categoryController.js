  import CategoryModel from "../models/categoryModels.js";
  import { ObjectId } from "mongodb";
  import { removeVietnameseAccents } from "../common/index.js";
  const sortObjects = [
    { code: "name_DESC", name: "Tên giảm dần" },
    { code: "name_ASC", name: "Tên tăng dần" },
    { code: "code_DESC", name: "Mã giảm dàn" },
    { code: "code_ASC", name: "Mã tăng dần" },
  ];
  export async function listCategory(req, res) {
    const search = req.query?.search;
    const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5;
    const page = !!req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * pageSize;
    let sort = !!req.query.sort ? req.query.sort : null;
    let filters = {
      deleteAt: null,
    };
    if (search && search.length > 0) {
      filters.searchString = {
        $regex: removeVietnameseAccents(search),
        $options: "i",
      };
    }

    let sortQuery = { createdAt: -1 };
    if (sort) {
      const sortArray = sort.split("_");
      sortQuery = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 };
    }

    try {
      const countCategories = await CategoryModel.countDocuments(filters);
      const categories = await CategoryModel.find(filters)
        .skip(skip)
        .limit(pageSize)
        .sort(sortQuery);

      res.render("pages/categories/list", {
        title: "Categories",
        categories: categories,
        countpagination: Math.ceil(countCategories / pageSize),
        pageSize,
        page,
        sort,
        sortObjects,
      });
    } catch (error) {
      console.log(error);
      res.send("Hiện tại không có sản phẩm nào");
    }
  }
  // export async function listCategory(req, res) {
  //   const search = req.query?.search;
  //   const pageSize = Math.max(1, parseInt(req.query.pageSize) || 5);
  //   const page = Math.max(1, parseInt(req.query.page) || 1);
  //   const skip = (page - 1) * pageSize;
  //   const sort = req.query.sort || null;

  //   let filters = { deleteAt: null };
  //   if (search && search.length > 0) {
  //     filters.searchString = {
  //       $regex: removeVietnameseAccents(search),
  //       $options: "i",
  //     };
  //   }

  //   let sortQuery = { createdAt: -1 }; // Sắp xếp mặc định
  //   if (sort) {
  //     const sortArray = sort.split('_');
  //     sortQuery = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 };
  //   }

  //   try {
  //     const countCategories = await CategoryModel.countDocuments(filters);
  //     const categories = await CategoryModel.find(filters)
  //       .sort(sortQuery)
  //       .skip(skip)
  //       .limit(pageSize);

  //     res.render("pages/categories/list", {
  //       title: "Danh mục",
  //       categories: categories,
  //       countpagination: Math.ceil(countCategories / pageSize),
  //       pageSize,
  //       page,
  //       sort,
  //       sortObjects,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Đã xảy ra lỗi khi tải danh mục.");
  //   }
  // }
  export async function renderPageCreateCategory(req, res) {
    res.render("pages/categories/form", {
      title: "Create Categories",
      mode: "Create",
      category: {},
      err: {},
    });
  }

  export async function createCategory(req, res) {
    const data = req.body;

    try {
      const category = await CategoryModel.findOne({
        code: data.code,
        deletedAt: null,
      });
      if (category) {
        throw "code";
      }
      await CategoryModel.create({
        ...data,
        createdAt: new Date(),
      });
      res.redirect("/categories");
    } catch (error) {
      console.log("error", error);
      let err = {};
      if (error === "code") {
        err.code = "Mã sãn phẩm đã tồn tại";
      }
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          err[key] = error.errors[key].message;
        });
      }
      console.log("err", err);
      res.render("pages/categories/form", {
        title: "Create Categories",
        mode: "Create",
        category: { ...data },
        err,
      });
    }
  }

  export async function renderPageUpdateCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryModel.findOne({
        _id: new ObjectId(id),
        deleteAt: null,
      });
      if (category) {
        res.render("pages/categories/form", {
          title: "Create Categories",
          mode: "Update",
          category: category,
          err: {},
        });
      } else {
        res.send("Hiện không có sản phẩm  nào phù hợp ");
      }
    } catch (error) {
      res.send("Trang web không tồn tại ! ");
    }
  }

  export async function UpdateCategory(req, res) {
    const { ...data } = req.body;
    const { id } = req.params;
    try {
      const category = await CategoryModel.findOne({
        code: data.code,
        deleteAt: null,
      });
      if (category) {
        throw "code";
      }
      await CategoryModel.updateOne(
        { _id: new ObjectId(id) },
        {
          ...data,
          updateAt: new Date(),
        }
      );
      res.redirect("/categories");
    } catch (error) {
      console.log(error);
      let err = {};
      if (error === "code") {
        err.code = "Mã sãn phẩm đã tồn tại";
      }
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          err[key] = error.errors[key].message;
        });
      }
      console.log("err", err);
      res.render("pages/categories/form", {
        title: "Update Categories",
        mode: "Update",
        category: { ...data, _id: id },
        err,
      });
    }
  }

  export async function renderPageDeleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryModel.findOne({
        _id: new ObjectId(id),
        deleteAt: null,
      });
      if (category) {
        res.render("pages/categories/form", {
          title: "Delete Categories",
          mode: "Delete",
          category: category,
          err: {},
        });
      } else {
        res.send("Hiện không có sản phẩm  nào phù hợp ");
      }
    } catch (error) {
      console.log(error);
      console.log("Trang web không tồn tại !");
    }
  }

  export async function deleteCategory(req, res) {
    const { id } = req.body;
    try {
      await CategoryModel.updateOne(
        { _id: new ObjectId(id), 
          deleteAt: null },
        {deleteAt: new Date()}
      );
      res.redirect("/categories");
    } catch (error) {
      console.log(error);
      res.send("Xóa  loại sản phẩm không thành công !");
    }
  }

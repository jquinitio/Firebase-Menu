import React, { useState, useEffect } from "react";
import { database, ref, set, update, remove, onValue, push } from "./firebase";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Form as BootstrapForm,
} from "react-bootstrap";
import "./themes.css";

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const itemsRef = ref(database, "items");
    onValue(itemsRef, (snapshot) => {
      const itemsData = snapshot.val();
      const itemsList = itemsData
        ? Object.keys(itemsData).map((key) => ({ id: key, ...itemsData[key] }))
        : [];
      setItems(itemsList);
    });
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const saveItem = (item, resetForm) => {
    const existingItem = items.find((existing) => existing.name === item.name);
    if (existingItem && (!item.id || existingItem.id !== item.id)) {
      alert("Item with this name already exists!");
      return;
    }

    if (item.id) {
      const itemRef = ref(database, `items/${item.id}`);
      update(itemRef, item);
    } else {
      const newItemRef = push(ref(database, "items"));
      set(newItemRef, { ...item, id: newItemRef.key });
    }
    resetForm();
    setEditingItem(null);
  };

  const editItem = (item) => {
    setEditingItem({
      ...item,
      options: item.options ? item.options : [],
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const deleteItem = (itemId) => {
    const itemRef = ref(database, `items/${itemId}`);
    remove(itemRef);
  };

  const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
    name: Yup.string().required("Name is required"),
    options: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Option is required"),
        price: Yup.number()
          .positive("Price must be greater than zero")
          .required("Price is required"),
        cost: Yup.number()
          .min(0, "Cost must be zero or more")
          .required("Cost is required"),
        stock: Yup.number()
          .min(0, "Stock must be zero or more")
          .required("Stock is required"),
      })
    ),
  });

  const categories = [...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? item.category === selectedCategory : true)
  );

  return (
    <Container className={darkMode ? "container-dark" : "container-light"}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Menu Manager</h1>
        <Button
          onClick={() => setDarkMode(!darkMode)}
          className={darkMode ? "button-dark" : "button-light"}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </Button>
      </div>
      <Formik
        initialValues={
          editingItem || {
            category: "",
            name: "",
            options: [],
            price: "",
            cost: "",
            stock: "",
          }
        }
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => saveItem(values, resetForm)}
      >
        {({ values, errors, touched }) => (
          <Form>
            <Row>
              <Col>
                Category
                <Field
                  name="category"
                  className={`form-control ${
                    darkMode ? "form-control-dark" : "form-control-light"
                  }`}
                />
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-danger"
                />
              </Col>
              <Col>
                Name
                <Field
                  name="name"
                  className={`form-control ${
                    darkMode ? "form-control-dark" : "form-control-light"
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </Col>
            </Row>
            <FieldArray name="options">
              {({ push, remove }) => (
                <div>
                  {values.options.length > 0 ? (
                    values.options.map((option, index) => (
                      <Row key={index}>
                        <Col>
                          Option
                          <Field
                            name={`options[${index}].name`}
                            className={`form-control ${
                              darkMode
                                ? "form-control-dark"
                                : "form-control-light"
                            }`}
                          />
                          <ErrorMessage
                            name={`options[${index}].name`}
                            component="div"
                            className="text-danger"
                          />
                        </Col>
                        <Col>
                          Price
                          <Field
                            name={`options[${index}].price`}
                            className={`form-control ${
                              darkMode
                                ? "form-control-dark"
                                : "form-control-light"
                            }`}
                          />
                          <ErrorMessage
                            name={`options[${index}].price`}
                            component="div"
                            className="text-danger"
                          />
                        </Col>
                        <Col>
                          Cost
                          <Field
                            name={`options[${index}].cost`}
                            className={`form-control ${
                              darkMode
                                ? "form-control-dark"
                                : "form-control-light"
                            }`}
                          />
                          <ErrorMessage
                            name={`options[${index}].cost`}
                            component="div"
                            className="text-danger"
                          />
                        </Col>
                        <Col>
                          Stock
                          <Field
                            name={`options[${index}].stock`}
                            className={`form-control ${
                              darkMode
                                ? "form-control-dark"
                                : "form-control-light"
                            }`}
                          />
                          <ErrorMessage
                            name={`options[${index}].stock`}
                            component="div"
                            className="text-danger"
                          />
                        </Col>
                        <Col>
                          <Button
                            variant="danger"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Row>
                      <Col>
                        Price
                        <Field
                          name="price"
                          className={`form-control ${
                            darkMode
                              ? "form-control-dark"
                              : "form-control-light"
                          }`}
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col>
                        Cost
                        <Field
                          name="cost"
                          className={`form-control ${
                            darkMode
                              ? "form-control-dark"
                              : "form-control-light"
                          }`}
                        />
                        <ErrorMessage
                          name="cost"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col>
                        Stock
                        <Field
                          name="stock"
                          className={`form-control ${
                            darkMode
                              ? "form-control-dark"
                              : "form-control-light"
                          }`}
                        />
                        <ErrorMessage
                          name="stock"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                    </Row>
                  )}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      onClick={() =>
                        push({
                          name: "",
                          price: values.price || "",
                          cost: values.cost || "",
                          stock: values.stock || "",
                        })
                      }
                    >
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
            </FieldArray>
            <div style={{ marginTop: "20px" }}>
              <Button type="submit">
                {editingItem ? "Update" : "Save"} Item
              </Button>{" "}
              {editingItem && (
                <Button variant="secondary" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <h2>Menu Items</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="category-filter" style={{ marginRight: "10px" }}>
            Filter by Category:
          </label>
          <BootstrapForm.Control
            as="select"
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={darkMode ? "form-control-dark" : "form-control-light"}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </BootstrapForm.Control>
          <label
            htmlFor="search-bar"
            style={{ marginLeft: "20px", marginRight: "10px" }}
          >
            Search:
          </label>
          <BootstrapForm.Control
            type="text"
            id="search-bar"
            placeholder="Product Name?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={darkMode ? "form-control-dark" : "form-control-light"}
          />
        </div>
      </div>

      <Table
        striped
        bordered
        hover
        className={darkMode ? "table-dark" : "table-light"}
        style={{ marginTop: "10px" }}
      >
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Options</th>
            <th>Price</th>
            <th>Cost</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>
                {Array.isArray(item.options)
                  ? item.options.map((option) => option.name).join(", ")
                  : ""}
              </td>
              <td>
                {Array.isArray(item.options)
                  ? item.options.map((option) => option.price).join(", ")
                  : item.price}
              </td>
              <td>
                {Array.isArray(item.options)
                  ? item.options.map((option) => option.cost).join(", ")
                  : item.cost}
              </td>
              <td>
                {Array.isArray(item.options)
                  ? item.options.map((option) => option.stock).join(", ")
                  : item.stock}
              </td>
              <td>
                <Button onClick={() => editItem(item)}>Edit</Button>
                <Button variant="danger" onClick={() => deleteItem(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MenuManager;

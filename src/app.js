import express from "express";
import path from "path";
import { title } from "process";
const app = express();
const port = 5001;
const __dirname = path.resolve();

app.use("/static", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views");

app.get("/", (req, res) => {
  res.render("pages/index",
    {title:"home"});
});
app.get("/components", (req, res) => {
  res.render("pages/components",
    {title:"components"});
});
app.get("/forms", (req, res) => {
  res.render("pages/forms",
    {title:"forms"});
});
app.get("/icons", (req, res) => {
  res.render("pages/icons"
    ,{title:"icons"}
);
});
app.get("/notifications", (req, res) => {
  res.render("pages/notifications",
    {title:"notifications"});
});
app.get("/tables", (req, res) => {
  res.render("pages/tables",
    {title:"tables"});
});
app.get("/typography", (req, res) => {
  res.render("pages/typography",
    {title:"typography"});
});
app.listen(port, function () {
  console.log("http://localhost:" + port);
});

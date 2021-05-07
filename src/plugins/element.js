import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Switch, Alert, Tabs, TabPane, Radio } from "element-ui";
import { Menu, MenuItem, Submenu, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn } from "element-ui";
import { Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option, DatePicker, RadioGroup, RadioButton, Cascader } from "element-ui"

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Radio)
//将弹框组件挂载至Vue的原型对象上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

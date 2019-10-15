import Vue from "vue";
import {
  LocaleProvider,
  Layout,
  Avatar,
  Progress,
  Button,
  Divider,
  Radio,
  Card,
  Row,
  Col,
  Cascader,
  Form,
  AutoComplete,
  Input,
  Pagination,
  Drawer,
  List,
  Icon,
  Badge,
  Select,
  Checkbox,
  Modal,
  message,
  notification,
  Spin
} from "ant-design-vue";

notification.config({
  placement: "bottomRight",
  duration: 3
});

message.config({
  top: "120px"
});

Vue.use(LocaleProvider);
Vue.use(Layout);
Vue.use(Avatar);
Vue.use(Progress);
Vue.use(Button);
Vue.use(Divider);
Vue.use(Radio);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Cascader);
Vue.use(Form);
Vue.use(AutoComplete);
Vue.use(Input);
Vue.use(Pagination);
Vue.use(Drawer);
Vue.use(List);
Vue.use(Icon);
Vue.use(Badge);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Modal);
Vue.use(message);
Vue.use(notification);
Vue.use(Spin);

Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;

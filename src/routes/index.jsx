import React from "react";
import { Route, Router, Switch } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import { Layout } from "../shared/Layout";
import Login from "../pages/login";
import Register from "../pages/register";
import Home from "../pages/home";
import Account from "../pages/account";
import Profile from "../pages/profile";
import ForgotPassword from "../pages/forgotPassword";
import ChangePassword from "../pages/changePassword";
import Help from "../pages/help";
import Policy from "../pages/policy";
import AboutUs from "../pages/aboutUs";
import WhoWeAre from "../pages/whoWeAre";
import ConfirmIndication from "../pages/ConfirmIndication";
import TermsAndConditions from "../pages/termsAndConditions";
import RegisterHomeAssistant from "../pages/registerHomeAssistant";
import RegisterWorker from "../pages/registerWorker";
import SearchProfessionals from "../pages/searchProfessionals";
import ProfessionalDetail from "../pages/professionalDetail";
import UserPaymentSuccess from "../pages/paymentSuccessUser";
import WorkerPaymentSuccess from "../pages/paymentSuccessWorker";
import SelectPaymentPlans from "../pages/selectPaymentPlans";
import RegisterWizard from "../pages/registerWizard";
import SafetyTips from "../pages/safetyTips";
import HomeAssistants from "../pages/homeAssistants";

const RestrictedArea = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/conta" component={Account} />
      <PrivateRoute exact path="/conta/perfil" component={Profile} />
      <PrivateRoute
        exact
        path="/conta/usuario/pagamento/sucesso"
        component={UserPaymentSuccess}
      />
      <PrivateRoute
        exact
        path="/conta/trabalhador/pagamento/sucesso"
        component={WorkerPaymentSuccess}
      />
      <PrivateRoute
        exact
        path="/conta/usuario/pagamento"
        component={SelectPaymentPlans}
      />
      <PrivateRoute
        exact
        path="/conta/trabalhador/pagamento"
        component={SelectPaymentPlans}
      />
      <PrivateRoute
        exact
        path="/conta/homeassistant/pagamento"
        component={SelectPaymentPlans}
      />
    </Switch>
  );
};

const Routes = ({ history }) => (
  <Router history={history}>
    <Layout>
      <Switch>
        <Route exact path="/trocar-senha" component={ChangePassword} />
        <Route exact path="/esqueceu-senha" component={ForgotPassword} />
        <Route exact path="/cadastro" component={Register} />
        <Route
          exact
          path="/cadastro/home-assistant"
          component={RegisterHomeAssistant}
        />
        <Route exact path="/cadastro/profissional" component={RegisterWorker} />
        <Route exact path="/cadastro/wizard" component={RegisterWizard} />
        <Route exact path="/cadastro/wizard/:type" component={RegisterWizard} />
        <Route exact path="/entrar" component={Login} />
        <Route exact path="/" component={Home} />
        <Route exact path="/ajuda" component={Help} />
        <Route exact path="/politica-de-seguranca" component={Policy} />
        <Route exact path="/sobre-nos" component={AboutUs} />
        <Route exact path="/quem-somos" component={WhoWeAre} />
        <Route exact path="/dicas-seguranca" component={SafetyTips} />
        <Route exact path="/home-assistants" component={HomeAssistants} />
        <Route
          exact
          path="/confirmacao_indicacao"
          component={ConfirmIndication}
        />
        <Route
          exact
          path="/termos-e-condicoes"
          component={TermsAndConditions}
        />
        <Route exact path="/profissionais" component={SearchProfessionals} />
        <Route exact path="/profissionais/:id" component={ProfessionalDetail} />
        <PrivateRoute path="/conta" component={() => RestrictedArea()} />
      </Switch>
    </Layout>
  </Router>
);

export default Routes;

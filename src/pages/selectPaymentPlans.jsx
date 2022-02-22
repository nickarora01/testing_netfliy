/* eslint-disable react/jsx-key */
import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Pane, Heading } from "evergreen-ui";
import { useActions } from "../configureStore";
import BtnPaypal from "../components/SelectPlan/BtnPaypal";
import CardPlan from "../components/SelectPlan/CardPlan";

const SelectPaymentPlans = (props) => {
  const { pathname } = useLocation();
  const getProfile = useActions((state) => state.user.getProfile);
  const paypalRef = useRef();
  const paypalRefThreeMonths = useRef();
  const paypalRefSixMonths = useRef();
  const paypalRefOneYear = useRef();
  const work_value = 10;
  const user_value = 5;

  const createCheckout = useActions((state) => state.payment.createCheckout);

  useEffect(() => {
    getProfile();
  }, []);

  const getIVA = (num) => {
    num = num / 4.35;
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const arrayPlansUser = [
    {
      productCode: "user_001",
      label: "1 mês",
      description: "30 dias",
      multiplication: 1,
      discount: 0,
      ref: paypalRef,
    },
    {
      productCode: "user_002",
      label: "3 meses",
      description: "90 dias",
      multiplication: 3,
      discount: 0.1,
      ref: paypalRefThreeMonths,
    },
    {
      productCode: "user_003",
      label: "6 meses",
      description: "180 dias",
      multiplication: 6,
      discount: 0.15,
      ref: paypalRefSixMonths,
    },
    {
      productCode: "user_004",
      label: "1 ano",
      description: "365 dias",
      multiplication: 12,
      discount: 0.2,
      ref: paypalRefOneYear,
    },
  ];

  const arrayPlansWorker = [
    {
      productCode: "worker_001",
      label: "3 meses",
      description: "90 dias",
      multiplication: 3,
      discount: 0,
      ref: paypalRef,
    },
  ];

  return (
    <Container>
      <Title>Escolha um plano</Title>
      {pathname === "/conta/usuario/pagamento" && (
        <Grid>
          {arrayPlansUser.map((plan) => {
            const value = user_value;
            let amount = value * plan.multiplication;
            amount =
              plan.discount === 0 ? amount : amount - amount * plan.discount;
            const iva = getIVA(amount);

            return (
              <>
                <CardPlan
                  title={plan.label}
                  amount={`${amount.toFixed(2)}`.replace(".", ",")}
                  paypal={
                    <BtnPaypal
                      btnRef={plan.ref}
                      amount={(amount + iva).toFixed(2)}
                      discount={amount * plan.discount}
                      iva={iva}
                      productDescription={plan.description}
                      productCode={plan.productCode}
                      productValue={value * plan.multiplication}
                      orderType={
                        pathname?.includes("usuario")
                          ? 1
                          : pathname?.includes("homeassistant")
                          ? 3
                          : 2
                      }
                    />
                  }
                  iva={`+ IVA de ${iva.toFixed(2)} €`.replace(".", ",")}
                  description={
                    plan.discount === 0
                      ? ""
                      : `${plan.discount * 100}% de desconto`
                  }
                />
              </>
            );
          })}
        </Grid>
      )}
      {pathname !== "/conta/usuario/pagamento" && (
        <Grid>
          {arrayPlansWorker.map((plan) => {
            const value = work_value;
            let amount = value;
            amount =
              plan.discount === 0 ? amount : amount - amount * plan.discount;
            const iva = getIVA(amount);

            return (
              <CardPlan
                title={plan.label}
                amount={`${amount.toFixed(2)}`.replace(".", ",")}
                paypal={
                  <BtnPaypal
                    btnRef={plan.ref}
                    amount={(amount + iva).toFixed(2)}
                    discount={amount * plan.discount}
                    iva={iva}
                    productDescription={plan.description}
                    productCode={plan.productCode}
                    productValue={value * plan.multiplication}
                    orderType={
                      pathname?.includes("usuario")
                        ? 1
                        : pathname?.includes("homeassistant")
                        ? 3
                        : 2
                    }
                  />
                }
                iva={`+ IVA de ${iva.toFixed(2)} €`.replace(".", ",")}
                description={
                  plan.discount === 0
                    ? ""
                    : `${plan.discount * 100}% de desconto`
                }
              />
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default SelectPaymentPlans;

const Container = styled(Pane)`
  max-width: ${(props) => props.theme.queries.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 3rem auto;

  @media (max-width: ${(props) => props.theme.queries.xl}) {
    margin: 3rem 1rem;
  }
`;

const Title = styled(Heading)`
  font-size: 2rem;
`;

const Grid = styled(Pane)`
  padding: 4rem 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  width: 100%;

  @media (max-width: ${(props) => props.theme.queries.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

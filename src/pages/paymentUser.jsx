import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Button } from "evergreen-ui";
import { List, ListItem } from "@chakra-ui/react";
import { theme } from "../theme";
import { formatToBRL } from "brazilian-values";
import { useActions, useStore } from "../configureStore";
import { FormattedMessage } from "react-intl";
import { GetProfile } from "../services/user";
import { PaypalActiveSubscription } from "../services/order";
import useScript from "../hooks/useScript";
import { FormatToEuro } from "../utils/helper";

const Checkout = (props) => {
  const [loaded, errorScript] = useScript(
    `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_ID}&vault=true`
  );
  const createCheckout = useActions((state) => state.payment.createCheckout);
  const getProfile = useActions((state) => state.user.getProfile);
  const listOrders = useActions((actions) => actions.order.listOrders);
  const count = useStore((state) => state.order.count);
  const user = useStore((state) => state.user.profile);
  const [error, setError] = useState(null);
  const paypalRef = useRef();

  useEffect(() => {
    getProfile();
    listOrders(0);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loaded &&
        paypalRef.current !== undefined &&
        window.paypal &&
        window.paypal
          .Buttons({
            style: {
              shape: "rect",
              color: "blue",
              layout: "horizontal",
            },
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: `Pagamento 4you`,
                    amount: {
                      currency_code: "EUR",
                      value: 20,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              // if (window.location.pathname?.includes("usuario")) {
              //   createCheckout({ order: res.data, type: 1 });
              // } else if (window.location.pathname?.includes("trabalhador")) {
              //   createCheckout({ order: res.data, type: 2 });
              // }
            },
            onError: (err) => {
              setError(err);
              console.error(err);
            },
          })
          .render(paypalRef.current);
    }, 1000);
  }, [loaded]);

  return (
    <Wrapper>
      <TitlePage>
        <FormattedMessage id="app.pagamento" defaultMessage="Pagamento" />
      </TitlePage>
      <List styleType="disc" padding={0}>
        <ListItem>Obtem acesso a plataforma por 30 dias.</ListItem>
      </List>
      <Hr />
      <ContainerValues>
        <RowValue>
          <DescriptionValue style={{ fontWeight: "bold" }}>
            <FormattedMessage
              id="app.valorTotal"
              defaultMessage="Valor Total"
            />
          </DescriptionValue>
          <Value style={{ fontWeight: "bold" }}>
            {user?.user_info?.type === 2 && count === 0
              ? FormatToEuro(0)
              : FormatToEuro(19.99)}
          </Value>
        </RowValue>
      </ContainerValues>
      <ContainerButton>{loaded && <div ref={paypalRef} />}</ContainerButton>
    </Wrapper>
  );
};

export default Checkout;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 500px;
  min-height: 500px;
  margin: 2rem auto;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    padding: 0 1rem;
  }
`;

const TitlePage = styled.h2`
  font-size: 26px;
  font-family: ${theme.font};
  margin-bottom: 1em;
`;

const Hr = styled.hr`
  color: #e4e7eb !important;
  width: 100%;
  margin: 20px 0;
`;

const ContainerValues = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowValue = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-bottom: 8px;
`;

const DescriptionValue = styled.span`
  font-size: 17px;
  font-family: ${theme.font};
  color: #53607e;
`;

const Value = styled.span`
  font-size: 17px;
  font-family: ${theme.font};
  color: #333;
`;
const ContainerButton = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 3em;
`;

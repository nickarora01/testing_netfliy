import React, { useEffect } from "react";
import styled from "styled-components";
import { Text as ChakraText } from "@chakra-ui/react";
import { useActions, useStore } from "../configureStore";
import { formatToBRL } from "brazilian-values";
import { FormattedMessage } from "react-intl";
import queryString from "query-string";

import logo from "../assets/images/tick-inside-circle.svg";
import card from "../assets/images/credit-card.svg";
import { FormatToEuro } from "../utils/helper";

const PaymentSuccess = (props) => {
  const query = queryString.parse(props.location.search);
  const queryId = query.id;

  const getCheckoutTransaction = useActions(
    (actions) => actions.payment.getCheckoutTransaction
  );
  const checkout = useStore((state) => state.payment.checkout);

  useEffect(() => {
    getCheckoutTransaction(queryId);
  }, []);

  return (
    <Wrapper>
      <WrapperPayment>
        <ImageCheck src={logo} alt="check" />
        <Container>
          <ContainerInfos>
            <LeftContainer>
              <ContainerSubTitle>
                <SubTitle style={{ marginTop: "5px;" }}>
                  {/* <FormattedMessage
                    id="app.checkoutDownloadFile"
                    defaultMessage="Baixe os arquivos em sua conta nos pedidos realizados"
                  /> */}
                  Pagamento realizado com sucesso.
                  <br />
                  <ChakraText marginBottom={0} fontWeight={500} fontSize="1rem">
                    - Acesso ao HomeAssist4u adquirido
                    {checkout?.label ? ` por ${checkout?.label}` : ""}.
                  </ChakraText>
                </SubTitle>
              </ContainerSubTitle>
              <CustomButton
                onClick={() =>
                  // props.history.push(`/meus-pedidos/detalhe/${checkout.id}`)
                  props.history.push(`/conta?tab=4`)
                }
              >
                {/* <FormattedMessage
                  id="app.verPedido"
                  defaultMessage="Ver Pedido"
                /> */}
                Visualizar Pagamento
              </CustomButton>
            </LeftContainer>
            <RightContainer>
              <ContainerSubTitle>
                <ImageSubTitle src={card} alt="entrega" />
                <SubTitle style={{ marginTop: "5px;" }}>
                  <FormattedMessage
                    id="app.informacaoDePagamento"
                    defaultMessage="Informações de pagamento"
                  />
                </SubTitle>
              </ContainerSubTitle>
              <Descriptions>
                <Text>Paypal</Text>
                <Text>
                  <FormattedMessage
                    id="app.pagamento"
                    defaultMessage="Pagamento"
                  />{" "}
                  ID: {checkout?.transaction_id}
                </Text>
                <Text>
                  <FormattedMessage
                    id="app.valorTotal"
                    defaultMessage="Valor Total"
                  />
                  : {FormatToEuro(checkout?.total)}
                </Text>
              </Descriptions>
            </RightContainer>
          </ContainerInfos>
        </Container>
      </WrapperPayment>
    </Wrapper>
  );
};

export default PaymentSuccess;

const Wrapper = styled.div`
  max-width: ${(props) => props.theme.queries.xl};
  margin: 4rem auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 0 1rem;
  }
`;

const WrapperPayment = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const ImageCheck = styled.img`
  width: 150px;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const Container = styled.div`
  margin-top: 20px;
  padding: 20px;
  width: 80%;
  border: 1px solid #e4e7eb;
  border-radius: 4px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    width: auto;
  }
`;

const Title = styled.h2``;
const SubTitle = styled.h3``;

const ContainerInfos = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    padding: 0 1rem;
    flex-direction: column-reverse;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    margin-bottom: 2rem;
    border-top: 1px solid #eee;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageSubTitle = styled.img`
  width: 50px;
  margin-right: 10px;
`;

const ContainerSubTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const Descriptions = styled.div``;
const Text = styled.h4``;

const CustomButton = styled.button`
  margin-top: 1em;
  background-color: ${(props) => props.theme.color.green};
  height: 40px;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  color: white;
  font-size: 0.9rem;
  border-radius: 0.2rem;
  transition: 0.3s;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  :focus {
    outline: none;
    opacity: 0.8;
  }
  :hover {
    opacity: 0.8;
  }
  :disabled {
    opacity: 0.8;
    pointer-events: none;
  }
  @media (max-width: 600px) {
    height: 50px;
  }
`;

import React, { useEffect, useState } from "react";
import { toaster } from "evergreen-ui";
import useScript from "../../hooks/useScript";
import { useActions, useStore } from "../../configureStore";

const BtnPaypal = (props) => {
  const [loaded, errorScript] = useScript(
    `https://www.paypal.com/sdk/js?currency=EUR&client-id=${process.env.REACT_APP_PAYPAL_ID}&vault=true`
  );
  const createCheckout = useActions((state) => state.payment.createCheckout);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      loaded &&
        props.btnRef.current !== undefined &&
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
                    description: `Pagamento homeassist4u.com`,
                    amount: {
                      currency_code: "EUR",
                      value: props.amount,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              createCheckout({
                total: props.amount,
                orderType: props.orderType,
                orderId: data?.orderID,
                discount: props.discount,
                iva: props.iva,
                productDescription: props.productDescription,
                productCode: props.productCode,
                productValue: props.productValue,
              });
            },
            onError: (err) => {
              setError(err);
              console.error(err);
              toaster.danger(
                "Ocorreu um erro ao realizar o pagamento, tente novamente!"
              );
            },
          })
          .render(props.btnRef.current);
    }, 2000);
  }, [loaded, errorScript]);

  return <div ref={props.btnRef}></div>;
};

export default BtnPaypal;

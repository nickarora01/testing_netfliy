import { PayPalButton } from "react-paypal-button-v2";
import React from "react";

export default function PayPalBtn(props) {
  const {
    amount,
    currency,
    createSubscription,
    onApprove,
    catchError,
    onError,
    onCancel,
  } = props;
  const paypalKey = process.env.REACT_APP_PAYPAL_ID;
  return (
    <PayPalButton
      amount={amount}
      currency={currency}
      createSubscription={(data, details) => createSubscription(data, details)}
      onApprove={(data, details) => onApprove(data, details)}
      onError={(err) => onError(err)}
      catchError={(err) => catchError(err)}
      onCancel={(err) => onCancel(err)}
      options={{
        clientId: paypalKey,
        vault: true,
        debug: true,
      }}
      style={{
        shape: "rect",
        color: "blue",
        layout: "horizontal",
        label: "subscribe",
      }}
    />
  );
}

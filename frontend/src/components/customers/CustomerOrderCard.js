import React, { useState } from "react";
import { Card, Button, Label, Rating } from "semantic-ui-react";
import { format } from "date-fns";
import NewReviewButton from "./NewReviewButton";
import Axios from "axios";

function CustomerOrderCard(props) {
  const [isExpanded, setExpanded] = useState(false);
  const order = props.order;
  const [rating, setRating] = useState(order.rating);

  const getStatus = () => {
    switch (order.status) {
      case 0:
        return ["Processing", "yellow"];
      case 1:
        return ["Delivering", "blue"];
      case 2:
        return ["Delivered", "green"];
      case 3:
        return ["Cancelled", "grey"];
      default:
        console.log("Unknown status");
        return ["Unknown", "black"];
    }
  };

  const handleRate = (e, { rating, MaxRating }) => {
    console.log("Rate clicked:", rating);
    const url = `http://localhost:5000/api/customers/rating`;
    Axios.post(url, {
      rating: `${rating}`,
      oid: `${order.oid}`,
    })
      .then((response) => {
        console.log("Successfully updated rating for order", response);
      })
      .catch((error) => {
        console.log("Error updating rating for order", error);
      });
  };

  return (
    <Card fluid raised color={getStatus()[1]}>
      <Card.Content>
        <Card.Header
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {order.rname}
          <span>${(order.fprice + order.dfee).toFixed(2)}</span>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <Card.Description>
          {format(order.odatetime * 1000, "MM/dd/yyyy hh:mm aa")}
          <Label color={[getStatus()[1]]} style={{ marginLeft: "1rem" }}>
            {getStatus()[0]}
          </Label>

          {order.status === 2 && (
            <>
              <NewReviewButton
                style={{ marginLeft: "1rem", marginRight: "1rem" }}
                oid={order.oid}
                rname={order.rname}
                review={order.review}
              />
              <Rating
                icon="star"
                maxRating={5}
                defaultRating={rating}
                onRate={handleRate}
              />
            </>
          )}

          <Button
            primary
            floated="right"
            onClick={() => setExpanded(!isExpanded)}
          >
            {isExpanded ? "View less" : "View more"}
          </Button>

          {order.status < 2 && (
            <Button secondary floated="right" content="Cancel" />
          )}
        </Card.Description>
        {isExpanded && (
          <Card.Description>
            Order number: {order.oid}
            <br />
            Delivery address: {props.order.location}
          </Card.Description>
        )}
      </Card.Content>
      {isExpanded && (
        <>
          <Card.Content>
            <Card.Description>
              {order.items.map((value, index) => {
                return (
                  <div
                    key={index}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {`${value.qty}x ${value.fname}`}
                    <span>${(value.qty * value.price).toFixed(2)}</span>
                  </div>
                );
              })}
            </Card.Description>
          </Card.Content>
          <Card.Content>
            <Card.Description>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                Subtotal
                <span>${order.fprice.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                Delivery fee
                <span>${order.dfee.toFixed(2)}</span>
              </div>
              <br />
              <strong>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Total
                  <span>${(order.fprice + order.dfee).toFixed(2)}</span>
                </div>
              </strong>
            </Card.Description>
          </Card.Content>
        </>
      )}
    </Card>
  );
}

export default CustomerOrderCard;

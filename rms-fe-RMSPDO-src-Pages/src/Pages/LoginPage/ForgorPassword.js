import React from "react";
import { Form, InputGroup, Alert } from "react-bootstrap";

import EnvelopeIcon from "../imgs/EnvelopeIcon";
import ArrowRIghtIcon from "../imgs/ArrowRIghtIcon";

function ForgotForm() {
  return (
    <div className="forgot-form">
      <Form>
        <InputGroup className="mb-4">
          <Form.Control
            placeholder="alma.lawson@example.com"
            aria-label="alma.lawson@example.com"
            type="text"
          />
          <InputGroup.Text className="input-icon">
            <EnvelopeIcon />
          </InputGroup.Text>
        </InputGroup>
        <button
          class="btn button-primary button-icon w-lg-50 w-100 mx-auto py-2"
          type="submit"
        >
          Send Verification Link <ArrowRIghtIcon />
        </button>
      </Form>
    </div>
  );
}

export default ForgotForm;

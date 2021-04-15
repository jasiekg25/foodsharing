import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./LoginRegister.css";
import { Button, Form } from "react-bootstrap";

const BasicForm = ({ inputs, schema, onSubmit, title }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login-title">
        <Form.Label>{title}</Form.Label>
      </div>

      {inputs.map((input, key) => {
        return (
          <div key={key} className="login-content form-group">
            <input
              className="login-control form-control"
              {...register(input.name)}
              type={input.type}
              placeholder={input.label}
            />
            {errors[input.name] && (
              <p className="error login-error">{errors[input.name].message}</p>
            )}
          </div>
        );
      })}

      <Button className="login-button" type="submit" variant="dark">
        {title}
      </Button>
    </form>
  );
};

export default BasicForm;

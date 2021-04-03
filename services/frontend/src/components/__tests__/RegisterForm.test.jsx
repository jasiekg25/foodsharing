import React from 'react';
import { cleanup, fireEvent, wait } from '@testing-library/react';

import RegisterForm from '../RegisterForm';

afterEach(cleanup);

describe('handles form validation correctly', () => {
  const mockProps = {
    handleRegisterFormSubmit: jest.fn(),
    isAuthenticated: jest.fn(),
  };

  test('when fields are empty', async() => {
    const {
      getByLabelText,
      container,
      findByTestId
    } = renderWithRouter(<RegisterForm {...mockProps} />);

    const form = container.querySelector('form');
    const usernameInput = getByLabelText('Username');
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');

    expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);

    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    expect((await findByTestId('errors-username')).innerHTML).toBe('Username is required.');
    expect((await findByTestId('errors-email')).innerHTML).toBe('Email is required.');
    expect((await findByTestId('errors-password')).innerHTML).toBe('Password is required.');

    fireEvent.submit(form);

    await wait(() => {
      expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);
    });
  });

  test('when email field is not valid', async() => {
    const {
      getByLabelText,
      container,
      findByTestId
    } = renderWithRouter(<RegisterForm {...mockProps} />);

    const form = container.querySelector('form');
    const emailInput = getByLabelText('Email');

    expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);

    expect((await findByTestId('errors-email')).innerHTML).toBe('Enter a valid email.');

    fireEvent.submit(form);

    await wait(() => {
      expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);
    });
  });

  test('when fields are not the proper length', async() => {
    const {
      getByLabelText,
      container,
      findByTestId
    } = renderWithRouter(<RegisterForm {...mockProps} />);

    const form = container.querySelector('form');
    const usernameInput = getByLabelText('Username');
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');

    expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);

    fireEvent.change(usernameInput, { target: { value: 'hi' } });
    fireEvent.change(emailInput, { target: { value: 't@t.c' } });
    fireEvent.change(passwordInput, { target: { value: 'hi' } });
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    expect((await findByTestId('errors-username')).innerHTML).toBe('Username must be greater than 4 characters.');
    expect((await findByTestId('errors-email')).innerHTML).toBe('Email must be greater than 7 characters.');
    expect((await findByTestId('errors-password')).innerHTML).toBe('Password must be greater than 4 characters.');

    fireEvent.submit(form);

    await wait(() => {
      expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);
    });
  });

  test('when fields are valid', async() => {
    const {
      getByLabelText,
      container,
      findByTestId
    } = renderWithRouter(<RegisterForm {...mockProps} />);

    const form = container.querySelector('form');
    const usernameInput = getByLabelText('Username');
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');

    expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);

    fireEvent.change(usernameInput, { target: { value: 'propername' } });
    fireEvent.change(emailInput, { target: { value: 't@t.com' } });
    fireEvent.change(passwordInput, { target: { value: 'properlength' } });
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    fireEvent.submit(form);

    await wait(() => {
      expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(1);
    });
  });

});


describe('renders', () => {
  const props = {
    handleRegisterFormSubmit: () => { return true },
    isAuthenticated: () => { return false },
  }

  test('properly', () => {
    const { getByText } = renderWithRouter(<RegisterForm {...props} />);
    expect(getByText('Register')).toHaveClass('button is-fullwidth secondary-btn is-rounded raised');
  });

  test('default props', () => {
    const { getByLabelText, getByText } = renderWithRouter(<RegisterForm {...props} />);

    const usernameInput = getByLabelText('Username');
    expect(usernameInput).toHaveAttribute('type', 'text');
    expect(usernameInput).not.toHaveValue();

    const emailInput = getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).not.toHaveValue();

    const passwordInput = getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).not.toHaveValue();

    const buttonInput = getByText('Register');
    expect(buttonInput).toHaveValue('Register');
  });

  test("a snapshot properly", () => {
    const { asFragment } = renderWithRouter(<RegisterForm {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

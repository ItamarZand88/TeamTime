import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useDroppable } from '@dnd-kit/core';
import DroppableCell from './DroppableCell';
import EmployeeCardInTable from './EmployeeCardInTable';
import { TableCell, Tooltip } from '@mui/material';

// Mock external dependencies
jest.mock('@dnd-kit/core', () => ({
  useDroppable: jest.fn(),
}));

jest.mock('./EmployeeCardInTable', () => jest.fn(() => Mocked EmployeeCardInTable));

describe('DroppableCell Component', () => {
  beforeEach(() => {
    useDroppable.mockReturnValue({
      setNodeRef: jest.fn(),
      isOver: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render();
    expect(screen.getByRole('cell')).toBeInTheDocument();
  });

  test('applies disabled styles when isDisabled is true', () => {
    render();
    const cell = screen.getByRole('cell');
    expect(cell).toHaveStyle('cursor: not-allowed');
    expect(cell).toHaveStyle('background-image: repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 2px, #e8e8e8 2px, #e8e8e8 4px)');
  });

  test('displays correct tooltip content', () => {
    render();
    expect(screen.getByText('1/2 employees')).toBeInTheDocument();
  });

  test('renders CheckOutlinedIcon when currentEmployees equals requiredEmployees', () => {
    render();
    expect(screen.getByTestId('CheckOutlinedIcon')).toBeInTheDocument();
  });

  test('renders AddTaskOutlinedIcon when currentEmployees is greater than requiredEmployees', () => {
    render();
    expect(screen.getByTestId('AddTaskOutlinedIcon')).toBeInTheDocument();
  });

  test('renders InfoOutlinedIcon when currentEmployees is less than requiredEmployees', () => {
    render();
    expect(screen.getByTestId('InfoOutlinedIcon')).toBeInTheDocument();
  });

  test('renders EmployeeCardInTable for each employee', () => {
    const employees = [
      { _id: '1', name: 'John Doe', position: 'Developer' },
      { _id: '2', name: 'Jane Smith', position: 'Designer' },
    ];
    render();
    expect(EmployeeCardInTable).toHaveBeenCalledTimes(2);
  });

  test('does not render EmployeeCardInTable for null employees', () => {
    const employees = [
      { _id: '1', name: 'John Doe', position: 'Developer' },
      null,
    ];
    render();
    expect(EmployeeCardInTable).toHaveBeenCalledTimes(1);
  });

  test('applies isOver styles when an item is dragged over', () => {
    useDroppable.mockReturnValue({
      setNodeRef: jest.fn(),
      isOver: true,
    });
    render();
    const cell = screen.getByRole('cell');
    expect(cell).toHaveStyle('background-color: #f7f7f7');
  });
});
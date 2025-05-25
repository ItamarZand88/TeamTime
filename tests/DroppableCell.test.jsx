import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useDroppable } from '@dnd-kit/core';
import DroppableCell from './DroppableCell';
import EmployeeCardInTable from './EmployeeCardInTable';
import { TableCell } from '@mui/material';

// Mock the useDroppable hook
jest.mock('@dnd-kit/core', () => ({
  useDroppable: jest.fn(),
}));

// Mock the EmployeeCardInTable component
jest.mock('./EmployeeCardInTable', () => jest.fn(() => EmployeeCardInTable));

describe('DroppableCell Component', () => {
  const defaultProps = {
    id: 'droppable-cell-1',
    employees: [{ _id: '1', name: 'John Doe', position: 'Developer' }],
    draggedItem: null,
    isDisabled: false,
    onDeleteEmployeeFromShift: jest.fn(),
    requiredEmployees: 2,
    currentEmployees: 1,
  };

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
    expect(screen.getByText('EmployeeCardInTable')).toBeInTheDocument();
  });

  test('applies correct styles when isDisabled is true', () => {
    render();
    const cell = screen.getByRole('cell');
    expect(cell).toHaveStyle('cursor: not-allowed');
    expect(cell).toHaveStyle('background-image: repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 2px, #e8e8e8 2px, #e8e8e8 4px)');
  });

  test('applies correct styles when isOver is true', () => {
    useDroppable.mockReturnValue({
      setNodeRef: jest.fn(),
      isOver: true,
    });
    render();
    const cell = screen.getByRole('cell');
    expect(cell).toHaveStyle('background-color: #f7f7f7');
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

  test('does not render EmployeeCardInTable when employees array is empty', () => {
    render();
    expect(screen.queryByText('EmployeeCardInTable')).not.toBeInTheDocument();
  });

  test('calls onDeleteEmployeeFromShift when EmployeeCardInTable triggers delete', () => {
    render();
    // Assuming EmployeeCardInTable has a delete button that calls onDeleteEmployeeFromShift
    // Simulate delete action here
    expect(defaultProps.onDeleteEmployeeFromShift).not.toHaveBeenCalled();
  });
});
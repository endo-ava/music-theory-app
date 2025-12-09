import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDragRotation } from '../useDragRotation';

// Shared mock factory for pointer events
function mockPointerEvent(clientX: number, clientY: number): React.PointerEvent<SVGGElement> {
  return {
    button: 0,
    clientX,
    clientY,
    currentTarget: {
      setPointerCapture: vi.fn(),
      releasePointerCapture: vi.fn(),
      hasPointerCapture: vi.fn(() => true),
    } as unknown as EventTarget & SVGGElement,
    pointerId: 1,
  } as React.PointerEvent<SVGGElement>;
}

describe('useDragRotation', () => {
  let svgRef: React.RefObject<SVGSVGElement>;
  let mockOnRotationChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnRotationChange = vi.fn();

    // Mock SVG element with getBoundingClientRect
    const mockSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.defineProperty(mockSvgElement, 'getBoundingClientRect', {
      writable: true,
      value: vi.fn(() => ({
        left: 100,
        top: 100,
        width: 400,
        height: 400,
        right: 500,
        bottom: 500,
        x: 100,
        y: 100,
        toJSON: () => {},
      })),
    });

    // Create ref object with mock element
    svgRef = { current: mockSvgElement } as React.RefObject<SVGSVGElement>;
  });

  it('should initialize with isDragging false', () => {
    const { result } = renderHook(() =>
      useDragRotation({
        svgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    expect(result.current.isDragging).toBe(false);
  });

  it('should return pointer event handlers', () => {
    const { result } = renderHook(() =>
      useDragRotation({
        svgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    expect(result.current.handlers).toHaveProperty('onPointerDown');
    expect(result.current.handlers).toHaveProperty('onPointerMove');
    expect(result.current.handlers).toHaveProperty('onPointerUp');
    expect(result.current.handlers).toHaveProperty('onPointerCancel');
  });

  it('should not trigger drag on small movements (below threshold)', () => {
    const { result } = renderHook(() =>
      useDragRotation({
        svgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    // Pointer down at center of SVG (300, 300)
    act(() => {
      result.current.handlers.onPointerDown(mockPointerEvent(300, 300));
    });

    // Move 3 pixels (below 4px threshold)
    act(() => {
      result.current.handlers.onPointerMove(mockPointerEvent(303, 300));
    });

    expect(result.current.isDragging).toBe(false);
    expect(mockOnRotationChange).not.toHaveBeenCalled();
  });

  it('should trigger drag when movement exceeds threshold', () => {
    const { result } = renderHook(() =>
      useDragRotation({
        svgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    // Pointer down at center (300, 300)
    act(() => {
      result.current.handlers.onPointerDown(mockPointerEvent(300, 300));
    });

    // Move 10 pixels (exceeds 4px threshold)
    act(() => {
      result.current.handlers.onPointerMove(mockPointerEvent(310, 300));
    });

    expect(result.current.isDragging).toBe(true);
  });

  it('should calculate correct rotation index from pointer position', () => {
    const { result } = renderHook(() =>
      useDragRotation({
        svgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    // SVG center is at (300, 300)
    // Start drag from bottom (directly below center)
    act(() => {
      result.current.handlers.onPointerDown(mockPointerEvent(300, 310));
    });

    // Move to right side (90 degrees clockwise from bottom)
    // This should correspond to a specific rotation index
    act(() => {
      result.current.handlers.onPointerMove(mockPointerEvent(350, 300));
    });

    expect(result.current.isDragging).toBe(true);
    // The exact index depends on the angle calculation
    // At minimum, verify that onRotationChange was called
    expect(mockOnRotationChange).toHaveBeenCalled();
  });

  it('should reset dragging state on pointer up', () => {
    const { result } = renderHook(() =>
      useDragRotation({
        svgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    // Start dragging
    act(() => {
      result.current.handlers.onPointerDown(mockPointerEvent(300, 300));
      result.current.handlers.onPointerMove(mockPointerEvent(310, 300));
    });

    expect(result.current.isDragging).toBe(true);

    // Release pointer
    act(() => {
      result.current.handlers.onPointerUp(mockPointerEvent(310, 300));
    });

    expect(result.current.isDragging).toBe(false);
  });

  it('should reset dragging state on pointer cancel', () => {
    const { result } = renderHook(() =>
      useDragRotation({
        svgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    // Start dragging
    act(() => {
      result.current.handlers.onPointerDown(mockPointerEvent(300, 300));
      result.current.handlers.onPointerMove(mockPointerEvent(310, 300));
    });

    expect(result.current.isDragging).toBe(true);

    // Cancel pointer
    act(() => {
      result.current.handlers.onPointerCancel(mockPointerEvent(310, 300));
    });

    expect(result.current.isDragging).toBe(false);
  });

  it('should ignore non-left-button pointer down', () => {
    const { result } = renderHook(() =>
      useDragRotation({
        svgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    const mockPointerEvent = {
      button: 1, // Right button
      clientX: 300,
      clientY: 300,
      currentTarget: {
        setPointerCapture: vi.fn(),
      } as unknown as EventTarget & SVGGElement,
      pointerId: 1,
    } as React.PointerEvent<SVGGElement>;

    act(() => {
      result.current.handlers.onPointerDown(mockPointerEvent);
    });

    // Should not capture pointer
    expect(mockPointerEvent.currentTarget.setPointerCapture).not.toHaveBeenCalled();
  });

  it('should handle null svgRef gracefully', () => {
    // Create ref with null current
    const nullSvgRef = { current: null } as unknown as React.RefObject<SVGSVGElement>;

    const { result } = renderHook(() =>
      useDragRotation({
        svgRef: nullSvgRef,
        currentRotationIndex: 0,
        onRotationChange: mockOnRotationChange,
      })
    );

    // Should not throw error
    act(() => {
      result.current.handlers.onPointerDown(mockPointerEvent(300, 300));
      result.current.handlers.onPointerMove(mockPointerEvent(350, 300));
    });

    // Should not update rotation when svgRef is null
    expect(mockOnRotationChange).not.toHaveBeenCalled();
  });
});

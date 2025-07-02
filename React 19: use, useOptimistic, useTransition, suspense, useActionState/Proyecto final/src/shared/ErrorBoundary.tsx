import React, { Component, ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

export class ErrorBoundary extends Component<Props> {
  /*
   * ErrorBoundary es un componente que captura errores en sus componentes hijos.
   * Si ocurre un error, renderiza un fallback UI en lugar de los componentes hijos.
   * @param fallback - Componente que se renderiza en caso de error.
   * @param children - Componentes hijos que pueden lanzar errores.
   * @example
   * <ErrorBoundary fallback={<div>Error al cargar</div>}>
   *   <MyComponent />
   * </ErrorBoundary>
   * @see
   *  */
  state: { hasError: boolean } = { hasError: false };

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: React.ErrorInfo) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    // logErrorToMyService(error, info.componentStack);
    console.log({ error, info });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

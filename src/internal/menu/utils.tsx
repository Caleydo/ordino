export const stopEvent = (event: React.MouseEvent<any>) => {
    event.preventDefault();
    event.stopPropagation();
  };

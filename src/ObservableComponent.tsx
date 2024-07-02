// src/ObservableComponent.jsx
import { useEffect, useState } from 'react';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

const ObservableComponent = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const observable = of('Hello from RxJS!').pipe(delay(1000));
    const subscription = observable.subscribe((msg) => setMessage(msg));

    return () => subscription.unsubscribe();
  }, []);

  return <div>{message}</div>;
};

export default ObservableComponent;
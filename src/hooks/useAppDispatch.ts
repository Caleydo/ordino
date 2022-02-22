import { useDispatch } from 'react-redux';
import { AppDispatch } from '..';

export const useAppDispatch = () => useDispatch<AppDispatch>();

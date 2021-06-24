import { useMemo } from 'react';

const useFileData = (file: null | string | File) => {
  const memo = typeof file === 'string' ? file : file?.name;
  const data = useMemo(() => {
    if (!file) return null;

    if (typeof file === 'string') return file;

    return URL.createObjectURL(file);
  }, [memo]);

  return data;
};
export default useFileData;

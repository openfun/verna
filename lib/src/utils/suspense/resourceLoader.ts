import { Maybe } from ':/types/utils';

export type ResourceLoader<DataType, ErrorType = Error> = {
  read: () => Promise<DataType> | DataType | ErrorType;
};

enum RESOURCE_STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * A resource loader used to lazy load a resource in a manner
 * that comply with a <Suspense />.
 * If you used this loader in a Component, you must wrap this component
 * in a <Suspense />.
 *
 * @param loader An asynchronous function that returns a promise
 *               with a payload of type DataType.
 *
 */
const resourceLoader = <DataType, ErrorType = Error>(
  loader: () => Promise<DataType>,
): ResourceLoader<DataType, ErrorType> => {
  let status = RESOURCE_STATUS.PENDING;
  let payload: Maybe<DataType | ErrorType>;
  let suspender = () =>
    loader()
      .then((response) => {
        status = RESOURCE_STATUS.SUCCESS;
        payload = response;
      })
      .catch((error: ErrorType) => {
        status = RESOURCE_STATUS.ERROR;
        payload = error;
      });

  return {
    read() {
      if (status === RESOURCE_STATUS.PENDING) {
        throw suspender();
      }
      if (status === RESOURCE_STATUS.ERROR) {
        return payload as ErrorType;
      }
      return payload as DataType;
    },
  };
};

export default resourceLoader;

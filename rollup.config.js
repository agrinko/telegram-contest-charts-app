import rollupDev from './rollup.config.dev';
import rollupProd from './rollup.config.prod';


export default args => {
  if (process.env.PRODUCTION)
    return rollupProd(args);
  else
    return rollupDev(args);
};

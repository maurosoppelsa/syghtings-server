import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import HealthCheckRoute from '@routes/healthcheck.route';
import SightsRoute from '@routes/sights.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new HealthCheckRoute(), new SightsRoute()]);
app.listen();

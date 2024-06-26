import 'dotenv/config';
import { createApp } from './createApp';

const app = createApp();

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

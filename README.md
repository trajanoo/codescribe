# codescribe

codescribe is an AI-powered platform that transforms any GitHub repository into a professional README and high-engagement LinkedIn post. It aims to enhance the presentation of code projects, making them more accessible and engaging to both developers and potential employers.

## Features

- **Automatic README Generation**: Creates professional README files based on repository content.
- **LinkedIn Post Creation**: Generates engaging LinkedIn posts tailored to your repository.
- **User Authentication**: Secure user login and registration via Supabase.
- **Project Management Dashboard**: Allows users to manage their projects and view history.

## Tech Stack

- **Frontend**: React, TypeScript, Framer Motion
- **Backend**: Express, Supabase
- **Database**: Supabase
- **Other**: dotenv, cors, @supabase/supabase-js

## Installation

To install dependencies, navigate to the project directory and run:

```bash
bun install
```

To start the application, execute:

```bash
bun run index.ts
```

This project was initialized using `bun init` in bun v1.3.10. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Usage

After starting the application, users can:

1. Register or log in via the authentication page.
2. Navigate to the dashboard to manage GitHub repositories.
3. Enter a repository URL to generate a README or LinkedIn post.
4. Customize the tone, length, and language of the generated content.

## Project Structure

The project is organized into several key directories:

- **/packages/client/app**: Contains the client-side application with pages for authentication, dashboard, and project management.
  - `auth/page.tsx`: User authentication component.
  - `dashboard/page.tsx`: Displays user project history and allows new project submissions.
  - `project/page.tsx`: Handles README and LinkedIn post generation based on user input.
- **/lib**: Contains utility functions, including Supabase integration.
- **/utils**: Helper functions for generating page URLs and other utilities.

## Future Improvements

- **Enhanced Customization**: Allow users to further customize the generated README and post formats.
- **Integration with Other Platforms**: Enable sharing directly to platforms like Twitter or personal blogs.
- **Analytics Dashboard**: Provide analytics on user interactions and engagements with generated content.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code follows the project's style guidelines.

## License

This project is licensed under the MIT License.

---

Generated with Codescribe™

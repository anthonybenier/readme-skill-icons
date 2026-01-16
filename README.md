# Readme Skill Icons ⚡️

Generate dynamic, beautiful SVG skill icons for your GitHub Profile README.

![Demo](https://skillicons.dev/icons?i=react,nextjs,typescript,tailwind,vercel&theme=dark)

## ✨ Features

- **Dynamic**: Generated on-the-fly via a robust API.
- **Customizable**: Choose between `dark` and `light` themes.
- **Flexible Layout**: Control how many icons appear per line (perfect for grids!).
- **Scalable**: Vector SVGs that look crisp at any size.
- **Vast Library**: Supports 3000+ icons via [Simple Icons](https://simpleicons.org/).

## 🚀 Usage

### 1. Build your Stack
Use the specific [Builder Interface](https://your-domain.vercel.app) to interactively search, select, and configure your stack.

### 2. Manual URL Construction
Alternatively, you can construct the URL manually:

```
https://your-domain.vercel.app/api/icons?i=slug1,slug2,slug3&param=value
```

#### Parameters

| Parameter | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `i` | Comma-separated list of icon slugs | `''` | `react,docker,aws` |
| `t` | Theme (`dark` or `light`) | `dark` | `light` |
| `perline` | Number of icons per line before wrapping | `15` | `5` |
| `size` | Size of each icon in pixels | `48` | `64` |

#### Examples

**Default Dark Theme:**
```markdown
![My Skills](https://your-domain.vercel.app/api/icons?i=react,ts,nextjs)
```

**Light Theme & Grid Layout:**
```markdown
![My Skills](https://your-domain.vercel.app/api/icons?i=react,ts,nextjs,aws,docker,linux&t=light&perline=3)
```

## 🛠️ For Developers

Want to fork this and host it yourself? It's open source!

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: `simple-icons` package

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/anthonybenier/readme-skill-icons.git
   cd readme-skill-icons
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**
   The project is optimized for Vercel. Simply import the repository and deploy. No environment variables are required.

### 💰 Cost & Performance Note

Concerned about hosting costs? Don't be.

1.  **Aggressive Caching**: Because these images are used on GitHub, they are cached by GitHub's "Camo" proxy. Your API is typically hit only **once** when a user first views a profile, and then GitHub serves the cached version.
2.  **CDN Caching**: The API returns a `Cache-Control: public, max-age=86400` header. Vercel's Edge Network will cache the SVG response for 24 hours. Even if GitHub re-fetches, it hits the cache, not your compute function.
3.  **Lightweight**: Generating text-based SVGs is CPU-cheap. You can handle huge traffic on Vercel's free tier.

## 🤝 Contributing

PRs are welcome! If you want to add a *new* icon, please contribute to [simple-icons](https://github.com/simple-icons/simple-icons) directly. We update our dependencies regularly to include the latest icons.

## 📄 License

MIT © [Anthony Benier]

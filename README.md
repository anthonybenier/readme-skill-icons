# Readme Icons

Generate dynamic, beautiful SVG skill icons for your GitHub Profile README.

![Demo](https://readme-icons.vercel.app/api/icons?i=react,nextjs,typescript,tailwind,vercel&theme=dark)

## Usage

### 1. Build your Stack
Use the [Builder Interface](https://your-domain.com) to interactively search, select, and configure your stack.

### 2. Manual URL Construction
Alternatively, you can construct the URL manually:

```
https://your-domain.com/api/icons?i=slug1,slug2,slug3&param=value
```

### Parameters

| Parameter | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `i` | Comma-separated list of icon slugs | `''` | `react,docker,aws` |
| `t` | Theme (`dark` or `light`) | `dark` | `light` |
| `perline` | Number of icons per line before wrapping | `15` | `5` |
| `size` | Size of each icon in pixels | `48` | `64` |
| `align` | Alignment of icons (`left`, `center`, `right`) | `left` | `center` |
| `labels` | Show technology name under icon (`true`, `false`) | `false` | `true` |

### Examples

**Default (Dark Theme)**
```markdown
![My Skills](https://your-domain.com/api/icons?i=react,ts,nextjs)
```

**Light Theme & Grid Layout**
```markdown
![My Skills](https://your-domain.com/api/icons?i=react,ts,nextjs,aws,docker,linux&t=light&perline=3)
```

**With Labels & Center Alignment**
```markdown
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://your-domain.com/api/icons?i=react,ts,nextjs&labels=true&align=center" />
  </a>
</p>
```

## For Developers

This project is open source.

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/anthonybenier/readme-icons.git
   cd readme-icons
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

## Support

If you find this project helpful, please consider giving it a ⭐ on GitHub! It helps a lot.

## License

MIT © [Anthony Benier]

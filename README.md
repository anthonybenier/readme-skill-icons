![Image](https://github.com/anthonybenier/readme-icons/blob/main/public/banner.png?raw=true)

# Readme Icons

Generate dynamic, beautiful SVG skill icons for your GitHub Profile README.

![Demo](https://readme-icons.vercel.app/api/icons?i=react,nextjs,typescript,tailwind,vercel&theme=dark)

## Usage

### 1. Build your Stack
Use the [Builder Interface](https://readme-icons.vercel.app/) to interactively search, select, and configure your stack.

### 1.1 Easy search
![Image](https://github.com/anthonybenier/readme-icons/blob/main/public/icon_search.gif?raw=true)

### 1.2 Tweak settings
![Image](https://github.com/anthonybenier/readme-icons/blob/main/public/tweak_settings.gif?raw=true)

### 1.3 Copy code
![Image](https://github.com/anthonybenier/readme-icons/blob/main/public/easy_copypaste.gif?raw=true)


### 2. Manual URL Construction
Alternatively, you can construct the URL manually:

```
https://readme-icons.vercel.app/api/icons?i=slug1,slug2,slug3&param=value
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

### Example

```markdown
![Icons](https://your-domain.com/api/icons?i=react,ts,nextjs,aws,docker&t=light)
```

## Icons

This project uses [Simple Icons](https://simpleicons.org/).
**Missing an icon?** Please check if it exists on Simple Icons first. If not, open an issue/PR there. We update our dependencies regularly.

## For Developers

1. **Clone & Install**
   ```bash
   git clone https://github.com/anthonybenier/readme-icons.git && cd readme-icons && npm install
   ```

2. **Run**
   ```bash
   npm run dev
   ```

## Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

## License

MIT © [Anthony Benier]

# 3D Models for Sanjeevani 2.0

This directory should contain the following 3D models in GLB format:

1. `heart.glb` - 3D model of a human heart
2. `lungs.glb` - 3D model of human lungs
3. `brain.glb` - 3D model of a human brain

## Recommended Sources

You can obtain free, optimized 3D models from the following sources:

1. [Sketchfab](https://sketchfab.com/search?q=medical&type=models) - Many free medical models
2. [Google Poly](https://poly.pizza/) - Archive of Google Poly models
3. [TurboSquid](https://www.turbosquid.com/Search/3D-Models/free/medical) - Free section

## Model Requirements

For optimal performance in a web application:

- File size: Keep each model under 2MB
- Polygon count: Aim for less than 50,000 polygons per model
- Format: GLB format (binary glTF)
- Textures: Optimized and embedded in the GLB file

## Converting Models

If you have models in other formats (OBJ, FBX, etc.), you can convert them to GLB using:

1. [Blender](https://www.blender.org/) (free, open-source)
2. [gltf.report](https://gltf.report/) (online converter)
3. [glTF Transform](https://gltf-transform.donmccurdy.com/) (online optimizer)

## Placeholder Models

Until you obtain detailed models, you can use basic geometric shapes as placeholders:

- Heart: Red sphere with slight deformations
- Lungs: Two elongated pink cylinders
- Brain: Gray sphere with wrinkle-like texture

## Optimization Tips

1. Remove unnecessary details that won't be visible
2. Reduce texture resolution to 1024x1024 or smaller
3. Use draco compression when exporting from Blender
4. Test models on mobile devices to ensure performance

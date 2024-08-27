import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

const generator = new PluginMetadataGenerator();

generator.generate({
  visitors: [
    new ReadonlyVisitor({ 
      dtoFileNameSuffix: ['*.ts'],
      introspectComments: true, 
      pathToSource: './src' 
    }),
  ],
  outputDir: './src',
  watch: false,
  tsconfigPath: './tsconfig.json',
});

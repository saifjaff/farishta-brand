from PIL import Image
from pathlib import Path
root=Path.cwd();source=root/'outputs/farishta-soft-companion/frames'
for state in ['flutter','greeting','spin']:
 out=root/'work/farishta-smooth'/state/'original';out.mkdir(parents=True,exist_ok=True)
 paths=sorted((source/state).glob('*.png'))
 for i,path in enumerate(paths):
  im=Image.open(path).convert('RGBA');bg=Image.new('RGBA',im.size,(239,247,239,255));bg.alpha_composite(im);bg.convert('RGB').save(out/f'{i:02}.png')
 (out.parent/'smooth').mkdir(exist_ok=True)

from PIL import Image,ImageOps
from pathlib import Path
import math
root=Path.cwd();out=root/'outputs/farishta-smooth-rig';work=root/'work/farishta-rig'
body=Image.open(out/'assets/body.png').convert('RGBA').resize((240,240),Image.Resampling.LANCZOS)
wing=Image.open(out/'assets/wing.png').convert('RGBA').resize((180,135),Image.Resampling.LANCZOS)
frames=[]
for i in range(90):
 t=i/25;phase=2*math.pi*t/1.2
 angle=math.radians(10*math.sin(phase));s=.86+.14*math.sin(phase)
 c=math.cos(angle);v=math.sin(angle);tx,ty=140,204;x0,y0=144,93
 inverse=(c/s,v/s,x0-(c*tx+v*ty)/s,-v,c,y0+v*tx-c*ty)
 left=wing.transform((400,400),Image.Transform.AFFINE,inverse,resample=Image.Resampling.BICUBIC)
 rig=Image.new('RGBA',(400,400));rig.alpha_composite(left);rig.alpha_composite(ImageOps.mirror(left));rig.alpha_composite(body,(80,50))
 # Translate the already-rendered rig as one object; no regenerated visual frames.
 y=round(5*math.sin(2*math.pi*t/3.6))
 canvas=Image.new('RGBA',(400,400),(239,247,239,255));canvas.alpha_composite(rig,(0,y))
 frames.append(canvas.convert('RGB'))
frames[0].save(out/'smooth-hover.webp',save_all=True,append_images=frames[1:],duration=40,loop=0,lossless=True,method=6)
palette=frames[0].quantize(colors=255)
gifs=[f.quantize(palette=palette) for f in frames]
gifs[0].save(out/'smooth-hover.gif',save_all=True,append_images=gifs[1:],duration=40,loop=0,disposal=2)
frames[0].save(work/'rig-still.png')
print('90 continuous rig poses rendered at 25fps; no generative frame changes.')

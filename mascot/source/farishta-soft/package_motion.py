from pathlib import Path
import importlib.util,json,shutil
from PIL import Image,ImageDraw,ImageFont
root=Path.cwd();out=root/'outputs/farishta-soft-companion'
spec=importlib.util.spec_from_file_location('extract_registered',root/'work/farishta-soft/extract_registered.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
source='/Users/saifjaffery/.codex/generated_images/01a13396-4a24-7e00-a565-369bbdad814e/exec-a9484ead-5f3a-4faa-a7b7-bd91605150d1.png'
im=Image.open(source).convert('RGBA');groups=m.component_frame_groups(im,6)
assert groups is not None and len(groups)==6
bounds=[m.component_bounds(g) for g in groups]
assert all(bounds[i][2]<bounds[i+1][0] for i in range(5))
frames=m.fit_registered_component_groups(im,groups)
dir=out/'frames/spin';dir.mkdir(exist_ok=True,parents=True)
for i,frame in enumerate(frames):
 frame.save(dir/f'{i:02}.png');frame.save(dir/f'{i:02}.webp',lossless=True,method=6)
report=json.loads((root/'work/farishta-soft/extraction.json').read_text())
report.append({'state':'spin','source':source,'frame_count':6,'source_bounds':bounds,'shared_row_scale':True})
manifest={'name':'Farishta','frameSize':320,'sequences':{'flutter':{'durations':[170,140,140,140,170,140]},'greeting':{'durations':[220,180,200,360]},'spin':{'durations':[180,140,140,180,140,140]}}}
allframes={}
background=(239,247,239,255)
for state,config in manifest['sequences'].items():
 fs=[Image.open(p).convert('RGBA') for p in sorted((out/'frames'/state).glob('*.png'))]
 assert len(fs)==len(config['durations'])
 assert all(f.size==(320,320) and f.getchannel('A').getextrema()[0]==0 for f in fs)
 config['frames']=[f'frames/{state}/{i:02}.webp' for i in range(len(fs))]
 allframes[state]=fs
 fs[0].save(out/f'{state}.webp',save_all=True,append_images=fs[1:],duration=config['durations'],loop=0,lossless=True,method=6)
 opaque=[Image.alpha_composite(Image.new('RGBA',f.size,background),f).convert('RGB') for f in fs]
 palette_source=Image.new('RGB',(320*len(fs),320),background[:3])
 for i,f in enumerate(opaque):palette_source.paste(f,(i*320,0))
 pal=palette_source.quantize(colors=255)
 gifs=[f.quantize(palette=pal) for f in opaque]
 gifs[0].save(out/f'{state}.gif',save_all=True,append_images=gifs[1:],duration=config['durations'],loop=0,disposal=2)
(out/'animation.json').write_text(json.dumps(manifest,indent=2))
(root/'work/farishta-soft/extraction.json').write_text(json.dumps(report,indent=2))
shutil.copy2(root/'outputs/farishta-glow-companion-option-1.png',out/'original-companion.png')
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia.ttf',24)
preview=[]
for tick in range(30):
 t=tick*120
 canvas=Image.new('RGB',(960,390),background[:3]);draw=ImageDraw.Draw(canvas)
 for col,(state,title) in enumerate([('flutter','Flutter & blink'),('greeting','A little wave'),('spin','Turn around')]):
  durations=manifest['sequences'][state]['durations'];pos=t%sum(durations);idx=0
  while pos>=durations[idx]:pos-=durations[idx];idx+=1
  f=allframes[state][idx]
  canvas.paste(f,(col*320,55),f)
  draw.text((col*320+160,24),title,font=font,fill='#204a38',anchor='mm')
 preview.append(canvas)
palette=preview[0].quantize(colors=255)
gifs=[p.quantize(palette=palette) for p in preview]
gifs[0].save(out/'motion-preview.gif',save_all=True,append_images=gifs[1:],duration=120,loop=0,disposal=2)
preview[0].save(root/'work/farishta-soft/preview-still.png')
# Preserve original visual prompts and source provenance with this deliverable.
shutil.copytree(root/'work/farishta-soft/prompts',out/'prompts',dirs_exist_ok=True)
(out/'source-provenance.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'frames':sum(len(fs) for fs in allframes.values()),'animations':list(allframes),'frame_size':[320,320],'output':str(out)}))

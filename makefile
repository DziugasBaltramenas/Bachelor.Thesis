build:
	xelatex -interaction=nonstopmode thesis.tex;
	biber thesis
	xelatex -interaction=nonstopmode thesis.tex;
	rm thesis.aux thesis.bcf thesis.log thesis.run.xml thesis.toc thesis.fdb_latexmk thesis.fls thesis.blg thesis
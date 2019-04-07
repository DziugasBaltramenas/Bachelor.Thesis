build:
	xelatex -interaction=nonstopmode practice.tex;
	biber practice
	xelatex -interaction=nonstopmode practice.tex;
	rm practice.aux practice.bcf practice.log practice.run.xml practice.toc practice.fdb_latexmk practice.fls practice.blg practice
build-plume2: clean-plume2 
	npx tsc --project packages/plume2/tsconfig.json
	@echo "build plume2 successfully ❤️ \n"

clean-plume2:
	rm -rf packages/plume2/es5
	@echo "clean plume2 successfully 👏 \n"